import {useMutation,useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {changeHome} from './home.functions';
import type {HomeAction} from './rules';
export function useHomeAction(){const qc=useQueryClient();return useMutation({mutationFn:(data:HomeAction)=>changeHome({data}),onSuccess:async()=>{await qc.invalidateQueries({queryKey:['home']});},onError:(e)=>toast.error(e.message)});}
