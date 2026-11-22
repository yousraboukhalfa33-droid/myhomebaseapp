import {createFileRoute} from '@tanstack/react-router';
import {Today} from '@/features/home/today';
import {homeOptions,pageHead} from '@/features/home/queries';
import {RouteError,RouteMissing} from '@/features/home/route-states';
export const Route=createFileRoute('/_authenticated/today')({head:()=>pageHead('Today','Your priorities, deadlines and daily check-in, at your own pace.'),loader:({context})=>context.queryClient.ensureQueryData(homeOptions),component:Today,errorComponent:RouteError,notFoundComponent:RouteMissing});
