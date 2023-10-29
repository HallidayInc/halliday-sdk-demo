In the project directory, run:

### `yarn start` or `yarn dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Walkthrough
There are two main screens, the login screen (src/LoginOptions.tsx) and the logged in screen (src/Content.tsx).

When you first open the app, you'll see the login screen. Login in via one of the social login options or via email.

You should now be shown the logged in screen, with a textbox and buttons below it to "Sign Date.now()", "Get Balances", etc. Upon page load, the textbox will show you your Halliday Smart Account information, including the smart account address (the address of the smart contract).

In `src/Content.tsx`, you can see how it all works. In the `useEffect`, `hallidayClient.getUserInfo()` returns the non-custodial signer that is the owner of the Halliday Smart Account. Then, we call `hallidayClient.getOrCreateHallidayAAWallet()` with this signer's address as the `in_game_player_id`; however, you can pass in your own system's player id as well.

"Sign Date.now()", "Get Balances", and "Get Assets" are self-explanatory and don't require any set up to use.

Using "Transfer 0.1 CRV to other account" (`hallidayClient.transferBalance`), "Transfer NFT to other account" (`hallidayClient.transferAsset`), and "Call Contract (Send 0.1 CRV to EOA)" (`hallidayClient.callContract`) require tinkering with the code to choose which player you want to send the asset to, or if you want to change which asset you want to send, or which contract you want to call. `transferBalance` and `transferAsset` can only be used to send assets to other Halliday players, so if you want to test these you can open two different browsers and sign up with two different users and send assets between them. If you want to send assets elsewhere or call contracts, use `callContract`.

Please let us know if you encounter any issues!
