import React, {PropsWithChildren, Suspense} from 'react';
import ReactLoaders from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';
import './loader.scss';

export const Loader = () => {
    return <div className="loader">
        <div>
            <ReactLoaders type="line-scale" active/>
            <p>Loading the website!</p>
        </div>
    </div>;
};

export default function SuspenseLoader({ children }: PropsWithChildren<{}>) {
    return (

        <Suspense fallback={<Loader/>}>
                { children }
            </Suspense>
    );
}
