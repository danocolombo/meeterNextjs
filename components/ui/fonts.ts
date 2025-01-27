import { Inter, Roboto, Charm, Lusitana, Newsreader } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const roboto = Roboto({
    subsets: ['latin'],
    weight: '500',
});

export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: '700',
});

export const charmFont = Charm({
    subsets: ['latin'],
    weight: '700',
    style: 'normal',
});
export const newsreaderFont = Newsreader({
    subsets: ['latin'],
    weight: ['300', '400'],
    style: ['normal'],
    variable: '--font-newsreader',
});
