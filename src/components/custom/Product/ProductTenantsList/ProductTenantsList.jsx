import React, { useState, useEffect } from "react";
import useGlobal from "../../../../lib/hocks/global";
import TenantStatus from "../../tenant/TenantStatus/TenantStatus";
import useRequest from "../../../../axios/apis/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEye, faGear } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Table,
  Button,
  ButtonGroup,
  Dropdown,
} from "@themesberg/react-bootstrap";
import TableDate from "../../Shared/TableDate/TableDate";
import { Link, Navigate } from "react-router-dom";

export const ProductTenantsList = ({ productId, productName }) => {
  const { DataTransform } = useGlobal();
  const { getProductTenants } = useRequest();
  const [list, setList] = useState([]);
  const [searchValue] = useState("");
  const [sortField] = useState("");
  const [sortValue] = useState("");
  const [first] = useState(0);
  const [rows] = useState(10);
  const [update] = useState(1);
  const [selectedProduct] = useState();

  useEffect(() => {
    let params = `${productId}/Tenants`;

    (async () => {
      const listData = await getProductTenants(params);
      console.log({ listData });
      setList(listData.data.data);
    })();
  }, [first, rows, searchValue, sortField, sortValue, update, selectedProduct]);

  const TableRow = (props) => {
    const {
      title,
      uniqueName,
      status,
      createdDate,
      editedDate,
      tenantId = "a00a5385-e535-4c65-a711-2446c3823515",
    } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">{title}</span>
        </td>
        <td>
          <span className="fw-normal">{uniqueName}</span>
        </td>
        <td>
          <span className="fw-normal">
            {status && <TenantStatus statusValue={status} />}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            <TableDate createdDate={createdDate} editedDate={editedDate} />
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to={`/tenantDetails/${tenantId}#${productName}`}>
                  <FontAwesomeIcon icon={faGear} className="me-2" /> Manage
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Title</th>
              <th className="border-bottom">Unique Name</th>
              <th className="border-bottom">Status</th>
              <th className="border-bottom">Created Date</th>
              <th className="border-bottom">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t, index) => (
              <TableRow key={`index`} {...t} />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductTenantsList;
