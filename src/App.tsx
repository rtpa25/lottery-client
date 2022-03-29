/** @format */
import { useEffect, useState } from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

function App() {
  const [manager, setManager] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>('');
  const [etherInput, setEtherInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const manager = await lottery.methods.manager().call();
      setManager(manager);
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
    };
    fetchData();
  }, [statusMessage]); //fetch data from the network when the status message changes

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setStatusMessage('Waiting for transaction success....');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(etherInput, 'ether'),
    });
    setStatusMessage('You are In!');
  };

  const winnerClickHandler = async () => {
    const accounts = await web3.eth.getAccounts();
    setStatusMessage('Waiting for transaction success....');
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setStatusMessage('Winner has been picked');
  };

  return (
    <div className='App'>
      <h1>Lottery Contract</h1>
      <p>
        This is a contract managed by {manager}. There are currently{' '}
        {players.length} people have entered the lottery to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={submitHandler}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={etherInput}
            onChange={(e) => {
              setEtherInput(e.target.value);
            }}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner</h4>
      <button onClick={winnerClickHandler}>Pick A Winner!</button>
      <hr />
      <h1>{statusMessage}</h1>
    </div>
  );
}

export default App;
