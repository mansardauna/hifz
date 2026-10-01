import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';
import { MOCK_COURSES } from '../../../src/services/mockData';
import { handleApiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'tenant-hifz';

    // 1. Try Prisma Database if configured
    if (process.env.DATABASE_URL) {
      try {
        const dbCourses = await prisma.course.findMany({
          where: {
            OR: [
              { tenantId },
              { tenant: { subdomain: tenantId.replace('tenant-', '') } },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbCourses && dbCourses.length > 0) {
          return NextResponse.json({ courses: dbCourses });
        }
      } catch (dbErr) {
        console.warn('Prisma courses lookup fallback to mock:', dbErr);
      }
    }

    // 2. Fallback to mock data matching tenant or defaults
    const filtered = MOCK_COURSES.filter(
      (c) => c.tenantId === tenantId || c.tenantId === `tenant-${tenantId}` || tenantId.includes(c.tenantId)
    );

    const courses = filtered.length > 0 ? filtered : MOCK_COURSES;
    return NextResponse.json({ courses });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, title, titleAr, description, descriptionAr, price, level, instructorName } = body;

    if (!title) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL && tenantId) {
      try {
        const newCourse = await prisma.course.create({
          data: {
            tenantId,
            title,
            description: description || '',
            instructor: instructorName || 'Certified Scholar',
            level: level || 'Beginner',
            lessons: body.modules || body.lessons || [],
          },
        });
        return NextResponse.json({ course: newCourse }, { status: 201 });
      } catch (err) {
        console.warn('Prisma create course fallback:', err);
      }
    }

    const mockCourse = {
      id: `course-${Date.now()}`,
      tenantId: tenantId || 'tenant-hifz',
      title,
      titleAr: titleAr || title,
      description: description || '',
      descriptionAr: descriptionAr || '',
      level: level || 'Beginner',
      instructorName: instructorName || 'Certified Scholar',
      instructorNameAr: instructorName || 'معلم معتمد',
      durationWeeks: 12,
      sessionsPerWeek: 3,
      price: Number(price) || 65,
      enrolledStudentsCount: 0,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    };

    MOCK_COURSES.unshift(mockCourse as any);
    return NextResponse.json({ course: mockCourse }, { status: 201 });
  } catch (error: any) {
    return handleApiError(error);
  }
}
