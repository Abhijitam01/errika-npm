import { OnlineGenerator } from '@/components/OnlineGenerator'

export const metadata = {
  title: 'Generate Online - Errika',
  description: 'Generate and download your project directly from the browser',
}

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-primary-50/20 to-gray-50 dark:from-gray-900 dark:via-primary-950/20 dark:to-gray-900 py-12">
      <OnlineGenerator />
    </div>
  )
}



