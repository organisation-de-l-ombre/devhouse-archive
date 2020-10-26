import React, {PropsWithChildren, Suspense} from 'react';
import ReactLoaders from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';
import './loader.scss';

export default function SuspenseLoader({ children }: PropsWithChildren<{}>) {
    return (

        <Suspense fallback={<div className="loader"><ReactLoaders type="line-scale" active/></div>}>
                { children }
            </Suspense>
    );
}
