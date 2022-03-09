import type { NextPage, NextPageContext } from 'next';
import { useAdmin } from '../hooks/route';

const Admin: NextPage = () => {
    return <div>Admin only</div>;
};

export async function getServerSideProps(ctx: NextPageContext) {
    const isAdmin = useAdmin({ ctx });
    return { props: { isAdmin } };
}

export default Admin;
