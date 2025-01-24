import React from 'react';
import { charmFont, newsreaderFont } from '@/components/ui/fonts';
const Meeter = () => {
    return (
        <div className='flex flex-col items-center'>
            <font
                className={`${charmFont.className} text-4xl font-bold md:text-5xl mb-0 mt-2`}
            >
                M
            </font>
            <span
                className={`${newsreaderFont.className} text-1xl font-bold md:text-2xl -mt-2`}
            >
                Meeter
            </span>
        </div>
    );
};

export default Meeter;
