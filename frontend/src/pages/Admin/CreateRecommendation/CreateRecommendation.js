import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './CreateRecommendation.css'


function CreateRecommendation() {

  const MySwal = withReactContent(Swal)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState(null)
  const [rating, setRating] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRatingFile, setSelectedRatingFile] = useState(null)
  const [noData, setNoData] = useState(true)
  const [noRatingData, setNoRatingData] = useState(true)

  const submit = async(event) => {
    event.preventDefault()
    let formData = new FormData()
    formData.append('avatar', selectedFile)
    const requestOptions = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: formData
    };
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/updateRecommendation`, requestOptions).catch((err) => {console.log(err)})
    let data = await response.json()
    if(response.status === 200){
      setResponse({data: data.data, courselist: data.courselist})
      setNoData(false)
    }else{
      MySwal.fire({
        icon: 'warning',
        title: data.message
      })
    }
  }

  const submitRating = async(event) => {
    event.preventDefault()
    let formData = new FormData()
    formData.append('avatar', selectedRatingFile)
    const requestOptions = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: formData
    };
    let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/updateRatingRecommendation`, requestOptions).catch((err) => {console.log(err)})
    let data = await response.json()
    if(response.status === 200){
      setRating({data: data.ratingData, genrelist: data.genrelist})
      setNoRatingData(false)
      
    }else{
      MySwal.fire({
        icon: 'warning',
        title: data.message
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        };
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/admin/viewRecommendation`, requestOptions).catch((err) => {
            console.log(err)
        })
        let data = await response.json()
        if(response.status === 200){
          if(data.message === "Have data"){
            setResponse({data: data.data, courselist: data.courselist})
            setRating({data: data.ratingData, genrelist: data.genrelist})
            setNoData(false)
            setNoRatingData(false)
          }else if(data.message === "No data"){
            setNoData(true)
          }else if(data.message === "Missing Rating"){
            setResponse({data: data.data, courselist: data.courselist})
            setNoData(false)
          }else{
            setRating({data: data.ratingData, genrelist: data.genrelist})
            setNoRatingData(false)
          }
          setLoading(false)
        }else{
          MySwal.fire({
            icon: "warning",
            title: "Unexpected Error. Please reload the page again."
          })
        }
    }
    fetchData()
  }, [])

  return (
    <div id='CreateRecommendationBase'>
      {loading?
        <>
          Fetching Data
        </>
        :
        <>
          <div id='title'>
            <p>Create Recommendation Data</p>
          </div>
          <div id='Download'>
            <p>Please use the excel file format provided by the system.</p>
            <p>The number of couses can append as many you can but supervisor and FYP genre must be provided</p>
            <p>Genre can be input multiples types with AI, Blockchains, Fintech, Game Development, Web/Mobile Application and Others</p>
            <br />
            <p>Donwload Past Student Course Grading excel template <Link to={"../../files/CreateRecommendationData.xlsx"}  target="_blank" download>here</Link></p>
          </div>
          <div id='Upload'>
            <div>Upload Past Student Course Grading Excel file</div>
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
          {noData? 
            <>
              Please Uploading Data
            </>
            :
            <> 
              <table>
                <caption style={{marginBottom: "2vh"}}>Past Student Course Grading Data</caption>
                <tbody>
                  <tr>
                    <th>
                      user/course
                    </th>
                    {
                      response.courselist.map((course) => {
                        return <><th key={course}>{course}</th></>
                      })
                    }
                  </tr>
                  {
                    Object.keys(response.data).map((user) => {
                      return (<tr key={user}>
                                <td>{user}</td>
                                {
                                  response.data[user].map((info) => {
                                    return <td key={`${user}_${info}`}>{info}</td>
                                  })
                                }
                              </tr>
                              )
                    })
                  }
                </tbody>
              </table>
            </>
          }

          <div id='DownloadRating'>
            <p>Please use the excel file format provided by the system.</p>
            <br />
            <p>Donwload Past Student Course Grading excel template <Link to={"../../files/CreateRecommendationRatingData.xlsx"}  target="_blank" download>here</Link></p>
          </div>
          <div id='UploadRating'>
            <div>Upload Past Student Genres Perfernce Ratings Excel file</div>
            <form>
              <input
                type="file"
                name="uploaded_file"
                onChange={e => setSelectedRatingFile(e.target.files[0])}
                accept=".csv, .xlsx"
              />
              <button onClick={(e) => {submitRating(e)}}>submit</button>
            </form>
          </div>
          {noRatingData? 
            <>
              Please Uploading Rating Data
            </>
            :
            <> 
              <table>
                <caption style={{marginBottom: "2vh"}}>Past Student Genres Perfernce Rating</caption>
                <tbody>
                  <tr>
                    <th>
                      user/genre
                    </th>
                    {
                      rating.genrelist.map((genre) => {
                        return <><th key={genre}>{genre}</th></>
                      })
                    }
                  </tr>
                  {
                    Object.keys(rating.data).map((user) => {
                      return (<tr key={user}>
                                <td>{user}</td>
                                {
                                  rating.data[user].map((info, index) => {
                                    return <td key={`${user}_${index}`}>{info}</td>
                                  })
                                }
                              </tr>
                              )
                    })
                  }
                </tbody>
              </table>
            </>
          }

        </>
      }
    </div>
  )
}

export default CreateRecommendation