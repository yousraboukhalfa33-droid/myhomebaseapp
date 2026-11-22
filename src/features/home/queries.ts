import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readHome } from './home.functions';
export const homeOptions = queryOptions({queryKey:['home'],queryFn:readHome,staleTime:30_000});
export const sessionOptions = queryOptions({queryKey:['identity'],queryFn:async()=>{const {data}=await supabase.auth.getUser();return data.user;},staleTime:60_000,retry:false});
export function pageHead(title:string,description:string){return {meta:[{title:`${title} · My Home Base`},{name:'description',content:description},{property:'og:title',content:`${title} · My Home Base`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
