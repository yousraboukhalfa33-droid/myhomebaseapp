import {createFileRoute,Navigate} from '@tanstack/react-router';
import {useSuspenseQuery} from '@tanstack/react-query';
import {AuthPage} from '@/features/home/auth';
import {sessionOptions,pageHead} from '@/features/home/queries';
import {RouteError,RouteMissing} from '@/features/home/route-states';
export const Route=createFileRoute('/auth')({ssr:false,head:()=>pageHead('Welcome home','Sign in to your calm personal home base for work, school and everyday life.'),loader:({context})=>context.queryClient.ensureQueryData(sessionOptions),component:Auth,errorComponent:RouteError,notFoundComponent:RouteMissing});
function Auth(){const {data}=useSuspenseQuery(sessionOptions);return data?<Navigate to="/today"/>:<AuthPage/>;}
