import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import Cells from './Cells';

const App = () => {
  const userFriendlyAddress = useTonAddress();

  return (
    <div className="app">
      <TonConnectButton />
      <div className="body">
        <Cells />
      </div>
    </div>
  );
}

export default App;
