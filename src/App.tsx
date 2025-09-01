import { Button } from "./components/ui/Button"
import { Card } from "./components/ui/Card"
import { PlusIcon } from "./components/icons/PlusIcon"
import { ShareIcon } from "./components/icons/ShareIcon"

function App() {

  return (
    <>
        <Card icon={<PlusIcon />} tags={['AI', 'React']} addedOn="2025-01-01" title="Project name" videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        </Card>
      <Button icon={<PlusIcon />}>Click me</Button>
      <Button variant="secondary" icon={<ShareIcon />}>Click me</Button>
    </>
  )
}

export default App
