import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { loginSts } from '../../../atom';
import { logOut } from '../../utilities/users-service';

export default function UserProfile() {
	const { name } = useParams();
	const [userOrders, setUserOrders] = useState(null);
	const [clickedOrder, setClickedOrder] = useState(null);
	const [setUser] = useAtom(loginSts);
	/* const [userOrderDetails , setUserOrderDetails] = useState(null);
	 */
	//fetch orders under userId
	useEffect(() => {
		const fetchOrderIds = async () => {
			try {
				const response = await fetch(`/api/user/${name}/orders`);
				const data = await response.json();
				setUserOrders(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchOrderIds();
	}, [name]);

	const handleOrderClick = async (order) => {
		try {
			console.log('orderid', order);
			const response = await fetch(`/api/order/products/${order}`);
			const data = await response.json();
			setClickedOrder(data);
			console.log('orderdata', clickedOrder);
		} catch (error) {
			console.error(error);
		}
	};

	const handleLogOut = () => {
		logOut();
		setUser('');
	};

	return (
		<>
			<div>
				<h4>Order History</h4>
				{userOrders &&
					userOrders.map((order) => (
						<div key={order}>
							<button onClick={() => handleOrderClick(order)}>
								Order {order}
							</button>
						</div>
					))}
			</div>
			<br></br>
			<div>
				<h4>Order Details</h4>
				<table>
					<thead>
						<tr>
							<th>Product</th>
							<th>Quantity</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{clickedOrder &&
							clickedOrder.orderLine?.map((lineItem) => (
								<tr key={lineItem._id}>
									<td>{lineItem.product_id.title}</td>
									<td>{lineItem.orderQty}</td>
									<td>${lineItem.extPrice}</td>
								</tr>
							))}
					</tbody>
				</table>
				<p>Order Total: ${clickedOrder && clickedOrder.orderTotal}</p>
			</div>
			<br></br>
			<button onClick={handleLogOut}>Log Out</button>
		</>
	);
}
