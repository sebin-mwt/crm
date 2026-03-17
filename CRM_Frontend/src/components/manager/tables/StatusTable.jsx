function StatusTable({ statuses, openAddModal, openEditModal }) {

  return (

    <div className="col-lg-12 col-md-12 pt-4">

      <div className="text-end pb-2">
        <button className="btn btn-outline-primary btn-sm" onClick={openAddModal}>
          + add status
        </button>
      </div>

      <div className="border shadow p-2" style={{ maxHeight: "390px", overflowY: "scroll" }}>

        <h5 className="text-center mt-3">
          <u>Status</u>
        </h5>

        <table className="table table-hover table-striped table-bordered align-middle text-center">

          <thead className="table-light">
            <tr>
              <th>sl.</th>
              <th>status</th>
              <th>stage</th>
              <th>action</th>
            </tr>
          </thead>

          <tbody>

            {statuses.length === 0 ? (

              <tr>
                <td colSpan="4" className="text-muted">
                  No Status Available
                </td>
              </tr>

            ) : (

              statuses.map((st, index) => (

                <tr key={st.id}>

                  <td>{index + 1}</td>

                  <td>{st.name}</td>

                  <td>{st.stage}</td>

                  <td>
                    <a href="#" onClick={() => openEditModal(st)}>
                      <i className="fa-solid fa-pen"></i>
                    </a>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default StatusTable;