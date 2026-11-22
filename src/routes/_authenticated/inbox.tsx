import {createFileRoute} from '@tanstack/react-router';
import {InboxPage} from '@/features/home/inbox';
import {homeOptions,pageHead} from '@/features/home/queries';
import {RouteError,RouteMissing} from '@/features/home/route-states';
export const Route=createFileRoute('/_authenticated/inbox')({head:()=>pageHead('Inbox','A quiet place for your thoughts, tasks and saved links.'),loader:({context})=>context.queryClient.ensureQueryData(homeOptions),component:InboxPage,errorComponent:RouteError,notFoundComponent:RouteMissing});
