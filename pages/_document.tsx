import Document, {Html, Head, Main, NextScript} from 'next/document'
import { resetServerContext } from 'react-beautiful-dnd';

// https://nextjs.org/docs/advanced-features/custom-document
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        // Fixes 'Warning: Prop data-rbd-draggable-context-id did not match. Server: "2" Client: "0"'
        resetServerContext();
        const initialProps = await Document.getInitialProps(ctx)
        return {...initialProps}
    }

    render() {
        return (
            <Html>
                <Head/>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument
