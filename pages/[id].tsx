import { NextPageContext } from 'next';
import { Stars, toJSON } from '../hooks/db';

const Token = ({ star }: { star: any }) => {
    return <p>Token: {star?._id}</p>;
}

export async function getServerSideProps(context: NextPageContext) {
    try {
        const { id } = context?.query;
        const star = await Stars.findOne({ name: id });
        return {
            props: { star: toJSON(star) },
        }
    } catch (e) {
        console.error(e);
        return {
            props: { star: undefined },
        }
    }
}

export default Token;
