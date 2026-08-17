import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import logoAsset from "@/assets/logo.png.asset.json"

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground text-center py-10">
          <img src={logoAsset.url} className="h-20 w-20 mx-auto mb-4 bg-white rounded-full p-2" />
          <CardTitle className="font-hindi text-2xl">एडमिन पैनल</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="font-bold">ईमेल</label>
            <Input type="email" placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <label className="font-bold">पासवर्ड</label>
            <Input type="password" />
          </div>
          <Button className="w-full py-6 text-lg bg-primary">लॉगिन करें</Button>
          <p className="text-center text-sm text-muted-foreground">
            सुरक्षित पहुँच के लिए अधिकृत विवरण दर्ज करें।
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
