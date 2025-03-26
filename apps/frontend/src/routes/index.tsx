import { getFingerprint } from '@/utils/fingerprint'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

async function printFingerprint(){
  const fingerprintString = await getFingerprint();
  console.log("fingerprintString", fingerprintString);
}

function RouteComponent() {
  
  return <div><Button onClick={printFingerprint}>Print Fingerprint</Button></div>
}
