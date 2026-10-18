import { prisma } from '../lib/prisma';
import { MOCK_RECITATIONS } from '../../services/mockData';
import { isDemoTenant } from '../../lib/tenants';

export class SubmissionService {
  static async getSubmissions(params: { tenantId?: string; userId?: string }) {
    const { tenantId, userId } = params;
    const cleanSubdomain = tenantId?.replace('tenant-', '');

    // Demo tenant sample recitations
    if (cleanSubdomain && isDemoTenant(cleanSubdomain)) {
      return MOCK_RECITATIONS;
    }

    if (process.env.DATABASE_URL) {
      try {
        const whereClause: any = {};
        if (tenantId) {
          whereClause.user = {
            tenant: {
              OR: [
                { id: tenantId },
                { subdomain: cleanSubdomain || tenantId },
                { id: `tenant-${cleanSubdomain || tenantId}` }
              ],
            },
          };
        }
        if (userId) {
          whereClause.userId = userId;
        }

        const list = await prisma.recitationSubmission.findMany({
          where: whereClause,
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        return list.map((sub) => {
          let parsedFeedback: any = {};
          if (sub.feedback) {
            try {
              parsedFeedback = JSON.parse(sub.feedback);
            } catch {
              parsedFeedback = { notes: sub.feedback };
            }
          }

          return {
            id: sub.id,
            studentId: sub.userId,
            studentName: sub.user?.name || 'Enrolled Student',
            surahNumber: sub.surahNumber,
            surahName: `Surah #${sub.surahNumber}`,
            ayahRange: `Ayahs ${sub.startAyah} - ${sub.endAyah}`,
            audioUrl: sub.audioUrl,
            score: sub.score,
            status: sub.status,
            teacherFeedback: parsedFeedback.notes || sub.feedback,
            teacherRemarks: parsedFeedback.notes || sub.feedback,
            teacherAudioFeedbackUrl: parsedFeedback.voiceFeedbackUrl,
            teacherAudioFeedbackDuration: parsedFeedback.voiceFeedbackDuration,
            mistakeTags: parsedFeedback.mistakeTags || [],
            submittedAt: sub.createdAt.toISOString(),
          };
        });
      } catch (err) {
        console.warn('Prisma getSubmissions query warning:', err);
      }
    }

    return [];
  }

  static async createSubmission(data: {
    userId: string;
    surahNumber: number;
    startAyah?: number;
    endAyah?: number;
    audioUrl?: string;
    title?: string;
    surahName?: string;
  }) {
    if (process.env.DATABASE_URL && data.userId) {
      try {
        let validUserId = data.userId;
        let userRecord = await prisma.user.findUnique({ where: { id: validUserId } });
        if (!userRecord) {
          userRecord = await prisma.user.findFirst({ where: { email: validUserId } });
          if (userRecord) {
            validUserId = userRecord.id;
          } else {
            throw new Error(`Enrolled student profile '${data.userId}' was not found in the academy database.`);
          }
        }

        const newSub = await prisma.recitationSubmission.create({
          data: {
            userId: validUserId,
            surahNumber: Number(data.surahNumber) || 1,
            startAyah: Number(data.startAyah) || 1,
            endAyah: Number(data.endAyah) || 10,
            audioUrl: data.audioUrl || '',
            status: 'Pending Review',
          },
        });
        return newSub;
      } catch (err) {
        console.warn('Prisma createSubmission error:', err);
      }
    }

    return {
      id: `rec-${Date.now()}`,
      userId: data.userId,
      surahNumber: data.surahNumber,
      audioUrl: data.audioUrl,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };
  }

  static async gradeSubmission(id: string, updates: { score?: number; feedback?: string; status?: string }) {
    if (process.env.DATABASE_URL && id) {
      try {
        return await prisma.recitationSubmission.update({
          where: { id },
          data: {
            score: updates.score,
            feedback: updates.feedback,
            status: updates.status || 'Graded',
          },
        });
      } catch (err) {
        console.warn('Prisma gradeSubmission error:', err);
      }
    }

    return { success: true, id, ...updates };
  }
}
