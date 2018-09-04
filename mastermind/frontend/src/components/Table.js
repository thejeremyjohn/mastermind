import React from "react";
import PropTypes from "prop-types";
import key from "weak-key";


const Table = ({ data, tableName }) =>
  !data.length ? (
    <div className="column">
      <h2 className="subtitle">
        <strong>{tableName}</strong>
      </h2>
    </div>
  ) : (
    <div className="column">
      <h2 className="subtitle">
        <strong>{tableName}</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            {
              Object.entries(data[0])
                .filter(el => el[0] !== 'id')
                .map(el => <th key={ key(el) }>{ el[0] }</th>)
            }
          </tr>
        </thead>
        <tbody>
          {data.map(el => (
            <tr key={el.id}>
              {
                Object.entries(el)
                  .filter(el => el[0] !== 'id')
                  .map(el => <td key={ key(el) }>{ el[1] }</td>)
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

Table.propTypes = {
  data: PropTypes.array.isRequired
};

export default Table;
