/**
 * Audit Logging Utility
 * Tracks sensitive admin and security actions in the database.
 */

import { AuditLog } from './models';
import { logger } from './logger';
import { NextRequest } from 'next/server';
import { getTokenFromRequest } from './api-auth';

interface AuditParams {
  action: string;
  category: 'AUTH' | 'ADMIN' | 'DATABASE' | 'SECURITY';
  userId?: string;
  userEmail?: string;
  resourceId?: string;
  details?: any;
  status?: 'SUCCESS' | 'FAILURE';
  request?: NextRequest;
}

/**
 * Persists an audit event to MongoDB.
 * Also logs to the server console via logger.
 */
export async function createAuditTrail(params: AuditParams) {
  const {
    action,
    category,
    resourceId,
    details,
    status = 'SUCCESS',
  } = params;
  
  try {
    const ip = params.request?.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = params.request?.headers.get('user-agent') || 'unknown';
    
    // Default to provided IDs or 'system'
    let finalUserId = params.userId || 'system';
    let finalUserEmail = params.userEmail || 'system';
    
    // Attempt to get user info from JWT if request is provided and IDs aren't already set
    if (params.request && (!params.userId || !params.userEmail)) {
      const decoded = getTokenFromRequest(params.request);
      if (decoded) {
        finalUserId = decoded.id;
        finalUserEmail = decoded.email;
      }
    }

    // Save to DB
    await AuditLog.create({
      action,
      category,
      userId: finalUserId,
      userEmail: finalUserEmail,
      ip,
      userAgent,
      resourceId,
      details,
      status,
    });

    // Mirror to standard logs
    const logData = { category, userId: finalUserId, userEmail: finalUserEmail, status, ...details };
    if (status === 'FAILURE') {
      logger.error(`AUDIT_FAIL: ${action}`, logData);
    } else {
      logger.info(`AUDIT: ${action}`, logData);
    }
  } catch (error) {
    // Fail silently to avoid breaking the main request if logging fails,
    // but at least report the logger error.
    logger.error('CRITICAL: Audit logging failed', error);
  }
}
