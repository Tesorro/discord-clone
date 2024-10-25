import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // чтобы админы не покидали сервер сами по ошибке. Данная запись означает: "Любой профиль может покинуть сервер, кроме того кто его создал", т.к. в БД в записи сервера хранится profileId того кто его создал
        },
        members: {
          some: {
            profileId: profile.id, // покидать сервер может только тот кто является участником сервера
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // удаляем пользователя из members которые относятся к данному серверу, используя profile.id
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_LEAVE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
