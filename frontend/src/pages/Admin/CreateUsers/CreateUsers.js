import React, {useState} from 'react';
import { Link } from "react-router-dom";
import "./CreateUsers.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function CreateUsers() {

  const MySwal = withReactContent(Swal)
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null)

  const submit = async(event) => {
    event.preventDefault()
    let formData = new FormData()
    formData.append('avatar', selectedFile)
    const requestOptions = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: formData
    };
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/createAccounts`, requestOptions).catch((err) => {console.log(err)})
    let data = await response.json()
    setResult(data)
  }

  return(
    <div id='CreateUsersBase'>
      <div id='title'>
          <p>Create User Account</p>
      </div>
      <div id='Download'>
        <p>Please use the excel file provided by the system. Maximum 90 user accounts can create per submission.</p>
        <br />
        <p>Donwload excel template <Link to={"../../files/CreateUserTemplate.xlsx"}  target="_blank" download>here</Link></p>
      </div>
      <div id='Upload'>
        <div>Upload User Creatation Form</div>
        <form>
          <input
            type="file"
            name="uploaded_file"
            onChange={e => setSelectedFile(e.target.files[0])}
            accept=".csv, .xlsx"
          />
          <button onClick={(e) => {submit(e)}}>submit</button>
        </form>
      </div>
      {/* should be using react excel render to show the error? */}
      <div id='Result'>
        <div>Result</div>
        <div id='log'>
          {(result === null)?
            <>
              <div>Please input excel file</div>
            </>
            :
            <>
              <table>
                <caption>{result.fileName}</caption>
                {Object.keys(result.data).length === 0? 
                  <>
                    <div style={{display: "flex", justifyContent: "center"}}>No Result</div>
                  </>
                :
                  <>
                    <thead>
                      <tr>
                        <th>Number</th>
                        {Object.keys(result.data[Object.keys(result.data)[0]]).map((header) => {return <th key={header}>{header}</th>})}
                      </tr>
                    </thead>
                    <tbody>
                    {Object.keys(result.data).map((row) => {
                      return <tr key={row}>
                                <td style={{textAlign: "center"}}>{row}</td>
                                <td style={{textAlign: "center"}}>{result.data[row].username}</td>
                                <td style={{textAlign: "center"}}>{result.data[row].message}</td>
                              </tr>
                    })}
                    </tbody>
                  </>
                  }
                </table>
            </>
          }
        </div>
      </div>
    </div>
  ) 
}

export default CreateUsers;

