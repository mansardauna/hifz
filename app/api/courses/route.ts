import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';
import { MOCK_COURSES } from '../../../src/services/mockData';
import { handleApiError } from '../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../src/server/lib/serverAuth';
import { isDemoTenant } from '../../../src/lib/tenants';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || request.headers.get('x-subdomain') || undefined;
    
    if (!tenantId) {
      return NextResponse.json({ courses: [] });
    }

    const cleanSubdomain = tenantId.replace('tenant-', '');
    const isDemo = isDemoTenant(cleanSubdomain) || isDemoTenant(tenantId);

    // 1. Try Prisma Database if configured
    if (process.env.DATABASE_URL) {
      try {
        const dbCourses = await prisma.course.findMany({
          where: {
            OR: [
              { tenantId },
              { tenant: { subdomain: cleanSubdomain } },
              { tenant: { id: tenantId } },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        // Non-demo tenant: return real database courses (or empty array)
        if (!isDemo) {
          return NextResponse.json({ courses: dbCourses || [] });
        }

        if (dbCourses && dbCourses.length > 0) {
          return NextResponse.json({ courses: dbCourses });
        }
      } catch (dbErr) {
        console.warn('Prisma courses lookup error:', dbErr);
        if (!isDemo) {
          return NextResponse.json({ courses: [] });
        }
      }
    }

    // 2. Non-demo accounts without DB records must return clean empty list
    if (!isDemo) {
      return NextResponse.json({ courses: [] });
    }

    // 3. Fallback to mock data ONLY for demo sandbox tenants
    const filtered = MOCK_COURSES.filter(
      (c) => c.tenantId === tenantId || c.tenantId === `tenant-${cleanSubdomain}` || tenantId.includes(c.tenantId)
    );

    const courses = filtered.length > 0 ? filtered : (isDemo ? MOCK_COURSES : []);
    return NextResponse.json({ courses });
  } catch (error: any) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin', 'teacher']);
    const body = await request.json();
    const effectiveTenantId = body.tenantId || authUser.tenantId;
    const { title, titleAr, description, descriptionAr, price, level, instructorName } = body;

    if (!title) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isOwner =
        authUser.tenantId === effectiveTenantId ||
        effectiveTenantId === `tenant-${cleanSub}` ||
        effectiveTenantId === cleanSub;

      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden: You can only publish courses for your assigned academy' }, { status: 403 });
      }
    }

    const tenantId = effectiveTenantId;

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
