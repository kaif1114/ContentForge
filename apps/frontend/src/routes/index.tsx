import { getFingerprint } from '@/utils/fingerprint'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { checkAuth } from '@/utils/auth';
export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: async ({location})=>{
    await checkAuth(location.href)
  }
})

async function printFingerprint(){
  const fingerprintString = await getFingerprint();
  console.log("fingerprintString", fingerprintString);
}

function RouteComponent() {
  
  return <div><Button onClick={printFingerprint}>Print Fingerprint</Button></div>
}
