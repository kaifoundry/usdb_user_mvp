import './App.css';
import {
  getAddress,
  AddressPurpose,
  BitcoinNetworkType
} from "sats-connect";

function App() {
  const handleLogin = async () => {
    try {
      console.log('Provider check:', window.BitcoinProvider);

      await getAddress({
        payload: {
          purposes: [
            AddressPurpose.Payment,  
            AddressPurpose.Ordinals 
          ],
          message: "Connect to my local app on Mainnet",
          network: {
            type: BitcoinNetworkType.Mainnet 
          }
        },
        onFinish: (response) => {
          console.log("Full response:", response);

          const paymentAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Payment
          );
          const ordinalsAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Ordinals
          );
          const stacksAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Stacks
          );

          console.log(' Payment Address:', paymentAddressItem?.address);
          console.log('Ordinals Address:', ordinalsAddressItem?.address);
          console.log('Stacks Address:', stacksAddressItem?.address);

          alert(`Payment: ${paymentAddressItem?.address}\nOrdinals: ${ordinalsAddressItem?.address}`);
        },
        onCancel: () => {
          alert('User cancelled the request.');
        },
      });

    } catch (err) {
      console.error(' Wallet error:', err);
      alert('An unknown error occurred. Check console.');
    }
  };

  return (
    <>
      <button className="bg-white border px-4 py-2 rounded" onClick={handleLogin}>
        Connect Xverse Wallet (Mainnet)
      </button>
    </>
  );
}

export default App;
