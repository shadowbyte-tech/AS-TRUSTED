import { connectDB, AIMemory } from '@/lib/models';
import { logger } from '@/lib/logger';
import { CoreMessage } from 'ai';

export class AIMemoryService {
  /**
   * Loads the chat history for a specific user.
   */
  static async loadChatHistory(userId: string): Promise<CoreMessage[]> {
    try {
      await connectDB();
      const historyDoc = await AIMemory.findOne({ 
        userId, 
        type: 'chat_history' 
      }).lean();

      if (!historyDoc || !historyDoc.messages) {
        return [];
      }

      // Convert from Mongoose schema to Vercel AI CoreMessage array
      return historyDoc.messages.map((m: any) => ({
        role: m.role as any,
        content: m.content
      }));
    } catch (error) {
      logger.error('Failed to load AI chat history:', error);
      return [];
    }
  }

  /**
   * Saves the updated chat history for a specific user.
   */
  static async saveChatHistory(userId: string, messages: CoreMessage[]): Promise<void> {
    try {
      await connectDB();
      
      const mappedMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: new Date()
      }));

      await AIMemory.findOneAndUpdate(
        { userId, type: 'chat_history' },
        { 
          $set: { messages: mappedMessages },
          $setOnInsert: { key: 'personal_advisor' }
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      logger.error('Failed to save AI chat history:', error);
    }
  }

  /**
   * Loads user investment preferences to inject into the AI context.
   */
  static async loadUserPreferences(userId: string): Promise<any> {
    try {
      await connectDB();
      const prefs = await AIMemory.find({ userId, type: 'preference' }).lean();
      
      const preferencesObj: Record<string, any> = {};
      for (const pref of prefs) {
        preferencesObj[pref.key] = pref.value;
      }
      
      return preferencesObj;
    } catch (error) {
      logger.error('Failed to load user AI preferences:', error);
      return {};
    }
  }
}
