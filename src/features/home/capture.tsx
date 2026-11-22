import {useState} from 'react';
import {Plus,Lightbulb,ListTodo,Link2,ArrowUpRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {useHomeAction} from './use-action';
import {toast} from 'sonner';

export function Capture(){const [open,setOpen]=useState(false); const [kind,setKind]=useState<'thought'|'task'|'link'>('thought');const [body,setBody]=useState('');const [url,setUrl]=useState('');const mutation=useHomeAction();return <>
<Button size="icon" className="capture-fab" onClick={()=>setOpen(true)} aria-label="Quick capture" title="Quick capture"><Plus/></Button>
<Dialog open={open} onOpenChange={setOpen}><DialogContent className="capture-dialog"><DialogTitle>Make a little space.</DialogTitle><DialogDescription>Save it now. Sort it out later.</DialogDescription><div className="capture-types">{([{key:'thought',icon:Lightbulb,label:'Thought'},{key:'task',icon:ListTodo,label:'Task'},{key:'link',icon:Link2,label:'Link'}] as const).map(t=><Button key={t.key} variant={kind===t.key?'secondary':'ghost'} onClick={()=>setKind(t.key)}><t.icon/>{t.label}</Button>)}</div><form className="form-stack" onSubmit={async e=>{e.preventDefault();await mutation.mutateAsync({action:'capture',kind,body,url:kind==='link'?url:null}).then(()=>{setBody('');setUrl('');setOpen(false);toast.success('Saved to your Inbox');}).catch(()=>{});}}><label htmlFor="capture-body">{kind==='link'?'A little context':'What’s on your mind?'}</label><Textarea id="capture-body" dir="auto" autoFocus value={body} onChange={e=>setBody(e.target.value)} placeholder="Let it all out…" required maxLength={10000}/>{kind==='link'&&<><label htmlFor="capture-url">Link</label><Input id="capture-url" type="url" value={url} onChange={e=>setUrl(e.target.value)} required placeholder="https://"/></>}<Button disabled={mutation.isPending} type="submit">{mutation.isPending?'Saving…':'Save to Inbox'}<ArrowUpRight/></Button></form></DialogContent></Dialog></>}
