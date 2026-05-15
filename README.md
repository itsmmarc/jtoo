# sooft

<img width="1920" height="1032" alt="image" src="https://github.com/user-attachments/assets/463df1ed-57bd-4a7e-8fcd-e97a274f659f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fffc59b5-51cf-4c35-a579-89784bf10dba" />

## obs quickstart - links to be updated

1. navigate to `Docks -> Custom Browser Docks`
2. add [https://sooft.dreamyard.xyz/controls](https://sooft.dreamyard.xyz/controls)
   <img width="787" height="218" alt="image" src="https://github.com/user-attachments/assets/568690dd-a249-4349-9f09-4d38c42a9ba3" />
3. navigate to `Sources -> Add Source -> Browser`
   <img width="612" height="716" alt="image" src="https://github.com/user-attachments/assets/54690b6e-7761-459b-bce0-8a1fb6702281" />

4. add [https://sooft.dreamyard.xyz/overlay](https://sooft.dreamyard.xyz/overlay)

that's all! you can access overlay controls in `Docks`

## development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev
```

to add or remove settings to the overlay, see the `PersistentState` objects in [src/lib/storage.svelte.ts](src/lib/storage.svelte.ts), which pages can import.
