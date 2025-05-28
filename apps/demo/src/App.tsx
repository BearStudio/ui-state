import { useState } from 'react'
import { getUiState } from '@bearstudio/ui-state';

function App() {
  const [count, setCount] = useState(0);

  const ui = getUiState((set) => {
    if (count === 0) return set('initial');
    if (count > 10) return set('over-10',);

    if (count % 2 === 1) return set('odd', { count });
    return set('peer', { count });
  })

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-8 relative border-1 size-[16rem] border-gray-500 rounded-xl p-4'>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <div className='flex gap-4'>
          <p className={ui.is('initial') ? "font-bold underline" : ""}>Initial</p>
          <p className={ui.is('odd') ? "font-bold underline" : ""}>Odd</p>
          <p className={ui.is('peer') ? "font-bold underline" : ""}>Peer</p>
          <p className={ui.is('over-10') ? "font-bold underline" : ""}>Over 10</p>
        </div>
        <div>
          {ui
              .match("initial", () => <p>Waiting to increase count</p>)
              .match("odd", ({ count }) => <p>{count} is odd</p>)
              .match("peer", ({ count }) => <p>{count} is peer</p>)
              .match("over-10", () => <p>Count is over 10</p>)
            .exhaustive()
          }
        </div>
        <div className='text-xs'>
          {ui
              .match("initial", () => <p>Click on "count is 0" to start</p>)
              .match("over-10", () => <p>Refresh to restart</p>)
            .nonExhaustive()
          }
        </div>
        {ui.when('odd', () => <div className='size-2 bg-amber-500 rounded-full absolute left-4'/>)}
        {ui.when('peer', () => <div className='size-2 bg-blue-500 rounded-full absolute right-4'/>)}
      </div>
      <a href="https://github.com/BearStudio/ui-state/tree/main/apps/demo/src/App.tsx" target="_blank">See source</a>
    </div>
  )
}

export default App
