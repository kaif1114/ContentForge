import { getFingerprint, hashFingerprint } from '@/auth/fingerprint'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    async function printFingerprint(){
      const fingerprintString = await getFingerprint();
      console.log("fingerprintString", fingerprintString);
      const fingerprintHash = await hashFingerprint(fingerprintString);
      console.log("fingerprintHash", fingerprintHash);
    }
    printFingerprint();
  }, [])
  return <div>Index page</div>
}
