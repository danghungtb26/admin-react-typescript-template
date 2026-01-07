import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'

const team = [
  { name: 'John Carter', email: 'contact@johncarter.com', progress: 60, color: 'bg-indigo-600' },
  { name: 'Sophie Moore', email: 'contact@sophiemoore.com', progress: 33, color: 'bg-purple-600' },
  { name: 'Matt Cannon', email: 'info@mattcannon.com', progress: 75, color: 'bg-pink-600' },
]

const TeamProgress = () => {
  return (
    <Card className="border-none shadow-sm rounded-xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-gray-800">Team progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {team.map((m, i) => (
          <div key={i} className="flex items-center gap-4">
            <div
              className={`size-9 rounded-full ${m.color} flex items-center justify-center text-white text-xs font-bold`}
            >
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{m.name}</div>
                  <div className="text-[10px] text-gray-500">{m.email}</div>
                </div>
                <span className="font-bold text-gray-900 text-xs">{m.progress}%</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${m.color}`} style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TeamProgress
