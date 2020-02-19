import React, { useCallback } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import LazyWallet from '../components/Wallets/LazyWallet';
import Modal from '../components/Modal/Modal';

import { useRootData } from '../hooks/useRootData';
import useWalletInit from '../hooks/useWalletInit';

import { WALLETS } from '../constants/Wallets';
import Web3 from 'web3';

const PrimaryPage: React.FC = (): JSX.Element => {
  const { createWallet } = useWalletInit();

  const {
    isAccessModalOpen,
    setAccessModal,
    setNormalBg,
    setProvider,
    setWalletName,
    setZkWallet,
    walletName,
    zkWallet,
  } = useRootData(
    ({
      isAccessModalOpen,
      setAccessModal,
      setEthBalances,
      setEthId,
      setEthWallet,
      setNormalBg,
      setProvider,
      setWalletName,
      setZkBalances,
      setZkWallet,
      walletName,
      zkWallet,
    }) => ({
      isAccessModalOpen: isAccessModalOpen.get(),
      setAccessModal,
      setEthBalances,
      setEthId,
      setEthWallet,
      setNormalBg,
      setProvider,
      setWalletName,
      setZkBalances,
      setZkWallet,
      walletName: walletName.get(),
      zkWallet: zkWallet.get(),
    }),
  );

  const web3: any = new Web3(Web3.givenProvider);

  const history = useHistory();

  const handleLogOut = useCallback(() => {
    setProvider(null);
    setWalletName('');
    setAccessModal(false);
    setZkWallet(null);
    history.push('/');
  }, [history, setAccessModal, setProvider, setWalletName, setZkWallet]);

  return (
    <>
      <LazyWallet />
      {zkWallet ? (
        <Redirect to="/account" />
      ) : (
        <>
          <Modal
            background={false}
            classSpecifier="metamask"
            visible={isAccessModalOpen}
            cancelAction={() => setAccessModal(false)}
          >
            <div className="metamask-logo"></div>
            {web3 && web3.currentProvider.networkVersion === '4' ? ( //need to change on prod
              <>
                <h3>Connected to Metamask</h3>
                <button className="btn submit-button" onClick={createWallet}>
                  Access my account
                </button>
              </>
            ) : (
              <>
                <h3>Connecting to Metamask</h3>
                <div className="wrong-network">
                  <div className="wrong-network-logo"></div>
                  <p>
                    You are in the wrong network. <br />
                    Please switch to mainnet
                  </p>
                </div>
                <button className="btn submit-button" onClick={() => handleLogOut()}>
                  Disconnect Metamask
                </button>
              </>
            )}
          </Modal>
          {!walletName && (
            <>
              <div className="logo-textless"></div>
              <div className="welcome-text">
                <h1>Welcome to ZK Sync.</h1>
                <h2>Simple, fast and secure token transfers.</h2>
                <p>Connect a wallet</p>
              </div>
              <div className="wallets-wrapper">
                {Object.keys(WALLETS).map(key => (
                  <button
                    key={key}
                    className="wallet-block"
                    onClick={() => {
                      setWalletName(key);
                      setNormalBg(true);
                    }}
                  >
                    <div className={`btn wallet-button ${key}`} key={key}></div>
                    <p>{key}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PrimaryPage;
