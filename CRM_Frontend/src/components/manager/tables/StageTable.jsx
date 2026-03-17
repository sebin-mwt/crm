function StageTable({ stages, openAddModal, openEditModal }) {

  return (

    <div className="col-lg-12 col-md-12">

      <div className="text-end pb-2">
        <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={openAddModal}>
          + add stage
        </button>
      </div>

      <div
        className="border shadow rounded-3 p-3 bg-white"
        style={{ maxHeight: "400px", overflowY: "scroll" }}
      >

        <h5 className="text-center mb-3">
          <u>Stages</u>
        </h5>

        <table className="table table-hover table-striped table-bordered align-middle text-center">

          <thead className="table-light">
            <tr>
              <th style={{ width: "80px" }}>sl.</th>
              <th>stage</th>
              <th style={{ width: "100px" }}>action</th>
            </tr>
          </thead>

          <tbody>

            {stages.length === 0 ? (

              <tr>
                <td colSpan="3" className="text-muted py-4">
                  No Stage Available
                </td>
              </tr>

            ) : (

              stages.map((stage, index) => (

                <tr key={stage.id}>
                  <td className="fw-semibold">{index + 1}</td>
                  <td className="text-capitalize">{stage.name}</td>
                  <td>
                    <a href="#" className="text-primary" onClick={() => openEditModal(stage)}>
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

export default StageTable;