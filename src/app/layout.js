import './globals.css';

export const metadata = {
  title: 'Fomi — Creative Workspaces',
  description: 'A responsive AI creation workspace concept and reference implementation.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
