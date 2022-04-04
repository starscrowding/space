import { NextPageContext } from 'next';
import Error from 'next/error';
import { Stars, toJSON } from '@space/hooks/db';

const Token = ({ star }: { star: any }) => {
    if (!star) {
        return <Error statusCode={404} />
    }
    return <p>Token: {star?._id}</p>;
}

export async function getServerSideProps(context: NextPageContext) {
    try {
        const { nameid } = context?.query;
        const split = (nameid as string).split('*');
        const [name, id] = [split.shift(), split.join('')];
        const star = await Stars.findOne({ name, id });
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
