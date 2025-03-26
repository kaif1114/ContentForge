import { getFingerprint, hashFingerprint } from '@/auth/fingerprint'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

async function printFingerprint(){
  const fingerprintString = await getFingerprint();
  console.log("fingerprintString", fingerprintString);
  const fingerprint = await hashFingerprint(fingerprintString);
  console.log("fingerprint", fingerprint);
}

function RouteComponent() {
  
  return <div><Button onClick={printFingerprint}>Print Fingerprint</Button></div>
}
