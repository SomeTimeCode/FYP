import React, {useEffect, useState, useRef} from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { useParams } from 'react-router-dom';
import { ImCross, ImCheckmark } from "react-icons/im";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './SupervisorGroupManage.css'

function Member(props){

    const [collect, drag] = useDrag(() => ({
            item: props.student,
            type: "student",
        }) ,[])

    return(
        <div className={props.className} ref={drag}>
            <p>{props.hashMap[props.student._id]}</p>
        </div>
    )
}

function ApprovedGroup(props){

    const [{canDrop}, drop] = useDrop(() => ({
        accept: "student",
        canDrop: (item, monitor) => {
            if(item.belongs === props.group._id){
                return false
            }
            return true
        },
        drop: (item, monitor) => {
            if(item.belongs === "none"){
                var newStudentList = [...props.newStudent]
                newStudentList = newStudentList.filter((student) => {
                    if(student._id === item._id && student.belongs === item.belongs && student.orignalGroup === item.orignalGroup){
                        return false
                    }else{
                        return true
                    }
                })
                var cloneItem = {...item}
                cloneItem["belongs"] = props.group._id
                var approvedGroupList = [...props.approvedGroups]
                for(var i = 0; i < approvedGroupList.length ; i++){
                    if(approvedGroupList[i]._id === props.group._id){
                        approvedGroupList[i].group_members.push(cloneItem)
                    }
                }
                props.setApprovedGroups(approvedGroupList)
                props.setNewStudent(newStudentList)
            }else{
                var approvedGroupList = [...props.approvedGroups]
                for(var i = 0; i < approvedGroupList.length; i++){
                    if(approvedGroupList[i]._id === props.group._id){
                        var cloneItem = {...item}
                        cloneItem["belongs"] = props.group._id
                        approvedGroupList[i].group_members.push(cloneItem)
                    }else if(approvedGroupList[i]._id === item.belongs){
                        approvedGroupList[i].group_members = approvedGroupList[i].group_members.filter((student) => {
                            if(student._id === item._id && student.belongs === item.belongs && student.orignalGroup === item.orignalGroup){
                                return false
                            }else{
                                return true
                            }
                        })
                    }
                }
                props.setApprovedGroups(approvedGroupList)
            }
        }
    }), [props.approvedGroups])

    return (
        <div className="approvedGroup" ref={drop}>
            <div className='groupName'>
                <p>Group {props.group.group_name}</p>
            </div>
            <div className='approveDrop'>
                {props.group.group_members.length > 0 && props.group.group_members.map((student) => {
                    return <Member className={(props.approvedGroups.some((group) => group._id === student.orignalGroup)) ? 'student' : 'none'} key={student._id} hashMap={props.hashMap} student={student}/>
                })}
            </div>
        </div>
    )
}

function AddStudent(props){
    const params = useParams();
    const MySwal = withReactContent(Swal)

    const [{canDrop}, drop] = useDrop(() => ({
        accept: "student",
        canDrop: (item, monitor) => {
            if(item.belongs === "none"){
                return false
            }
            if(props.approvedGroups.some((group) => group._id === item.orignalGroup)){
                return false
            }
            return true
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop()
        }),
        drop: (item, monitor) => {
            var list = [...props.newStudent]
            list.push({_id: item._id, belongs: "none", orignalGroup: item.orignalGroup})
            var approvedGroupList = [...props.approvedGroups]
            for(var i = 0; i < approvedGroupList.length; i++){
                if(approvedGroupList[i]._id === item.belongs){
                    approvedGroupList[i].group_members = approvedGroupList[i].group_members.filter((student) => {
                        if(student._id === item._id && student.belongs === item.belongs && student.orignalGroup === item.orignalGroup){
                            return false
                        }else{
                            return true
                        }
                    })
                }
            }
            props.setApprovedGroups(approvedGroupList)
            props.setNewStudent(list)
        }
    }), [props.approvedGroups, props.newStudent])

    const addStudent = async () => {
        const {value: input, isConfirmed} = await MySwal.fire({
            title: "Add Student",
            showCancelButton: true,
            input: 'text',
            inputValue: '',
            inputPlaceholder: "Student's Username/Contact",
            confirmButtonText: 'Add',
            inputValidator: (result) => {
                return !result && 'You need to input username or contact to add the student'
            }
        })
        if(!isConfirmed){
            return
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({input: input, topic_id: params.id})
        };
        await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/addStudent`, requestOptions).then(async (response) =>{
            let data = await response.json()
            if(response.status === 200){
                console.log(data)
                if(props.hashMap[data._id]){
                    MySwal.fire({
                        title: <p>Already Added</p>,
                        icon: 'warning',
                        confirmButtonColor: '#3085d6',
                    })
                }else{
                    MySwal.fire({
                        title: <p>Add Student Success</p>,
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    })
                    .then(() => {
                        var list = [...props.newStudent]
                        var clone = {...props.hashMap}
                        clone[data._id] = data.username
                        list.push({_id: data._id, belongs: data.belongs, orignalGroup: data.orignalGroup})
                        props.setNewStudent(list)
                        props.setHashMap(clone)
                    })
                }
            }else{
                MySwal.fire({
                    title: <p>{data.message}</p>,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                })
            }
        })
    }

    return(
        <div id='addStudentSlot'>
            <button onClick={(e)=>{addStudent()}}>Add Student</button>
            <div id='addStudentSlotDrop' ref={drop}>
                {props.newStudent.length > 0 && props.newStudent.map((student) => {
                    return <Member className={"newStudent"} key={student._id} hashMap={props.hashMap} student={student}/>
                })}
            </div>
        </div>
    )
}


function PendingGroup(props){   

    const MySwal = withReactContent(Swal)

    const approve = () => {
        MySwal.fire({
            title: <p>Approve {props.hashMap[props.group_members[0]]}'s group? </p>,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "No",
            cancelButtonColor: "#FF0000",
            confirmButtonText: "Yes",
            confirmButtonColor: '#3085d6',
          }).then(async (result) => {
                if (result.isConfirmed) {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: JSON.stringify({_id: props._id })
                    };
                    await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/approveGroup`, requestOptions).then(async (response) =>{
                        let data = await response.json()
                        if(response.status === 200){
                            return (
                                MySwal.fire({
                                    title: <p>Successfully approve {props.hashMap[props.group_members[0]]}'s group</p>,
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                })
                                .then(() => {
                                    window.location.reload()
                                })
                            )
                        }else{
                            throw new Error(data.message)
                        }
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
                }
        })
    }

    const reject = async() => { 
        MySwal.fire({
            title: <p>Reject {props.hashMap[props.group_members[0]]}'s group? </p>,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "No",
            cancelButtonColor: "#FF0000",
            confirmButtonText: "Yes",
            confirmButtonColor: '#3085d6',
          }).then(async (result) => {
                if (result.isConfirmed) {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                        body: JSON.stringify({_id: props._id })
                    };
                    await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/rejectGroup`, requestOptions).then(async (response) =>{
                        let data = await response.json()
                        if(response.status === 200){
                            return (
                                MySwal.fire({
                                    title: <p>Successfully reject {props.hashMap[props.group_members[0]]}'s group</p>,
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                })
                                .then(() => {
                                    window.location.reload()
                                })
                            )
                        }else{
                            throw new Error(data.message)
                        }
                    }).catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
                }
        })
    }

    return (
        <div className='pendingGroup'>
            <div className='group'>
                <p>Group</p>
            </div>
            {  
                <div className='members'>
                    {
                        props.group_members.map((member) => {
                            return (
                                <>
                                    <p key={member}>{props.hashMap[member]}</p>
                                </>
                            )
                        })
                    }
                </div>
            }
            <div className='buttons'>
            <button onClick={(e) => {approve()}}><ImCheckmark color='green'/>approve</button> 
                <button onClick={(e) => {reject()}}><ImCross color='red'/>reject</button>
            </div>
        </div>
    )
}



function SupervisorGroupManage() {

    const params = useParams();
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()
    const [newStudent, setNewStudent] = useState([])
    const [hashMap, setHashMap] = useState({})
    const [approvedGroups, setApprovedGroups] = useState([])
    const count = useRef(1)

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/${params.id}`, requestOptions)
                                .then((response) => {
                                    if(response.status === 200){
                                        return response.json()
                                    }else{
                                        return []
                                    }
                                }).then((data) => {
                                    if(data.length !== 0){
                                        return data
                                    }else{
                                        return {topic_list: [], last: true}
                                    }
                                })
            var {student_hashMap, approved_groups, ...rest} = response
            setHashMap(student_hashMap)
            setData(rest)
            setApprovedGroups(approved_groups)
            console.log(student_hashMap)
            console.log(approved_groups)
            console.log(rest)
            setLoading(false)
        }
        fetchData()
    }, [])


    const createGroup = () => {
        MySwal.fire({
            title: "Are you sure to create a new group?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if(result.isConfirmed){
                var approvedGroupList = [...approvedGroups]
                approvedGroupList.push({_id: `newGroup_${count.current}`, group_name: `New Create ${count.current}`, group_members: []})
                count.current += 1
                setApprovedGroups(approvedGroupList)
            }
        })
    }

    const submitChange = async () => {
        const {value: isConfirmed} = await MySwal.fire({
            title: "Are you sure to make changes?",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            icon: "question"
        })
        if(isConfirmed){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                body: JSON.stringify({approvedGroups: approvedGroups, topic_id: data._id})
            };
            await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/supervisor/group/adjustGroup`, requestOptions)
                    .then((response) => {
                        if(response.status === 200){
                            MySwal.fire({
                                icon: "success",
                                title: "Success to adjust group",
                            }).then(() => {
                                window.location.reload()
                            })
                        }else{
                            MySwal.fire({
                                icon: "warning",
                                title: "Oops something goes wrong"
                            })
                        }
                    })
        }
    }

    return (
        <>
            {loading ?
                <div>fetching data</div>
            :
                <div id='SupervisorGroupManageBase'>
                    <div id='title'>
                        {data.topic_name}
                    </div>
                    <div id='pendingSlot'>
                        {data.pending_groups .length > 0 ? 
                            // [] --> data.pending_groups 
                            data.pending_groups.map((group) => {
                                return <PendingGroup key={group._id} _id={group._id} group_members={group.group_members} hashMap={hashMap}/> 
                            })
                            :
                            <div style={{fontSize: "2vh"}}>No pending groups available</div>
                        }
                    </div>
                    <div id='approveSlot'>
                        <DndProvider backend={ (window.innerWidth > 800 ? HTML5Backend : TouchBackend)}>
                            <AddStudent newStudent={newStudent} hashMap={hashMap} setHashMap={setHashMap} setNewStudent={setNewStudent} setApprovedGroups={setApprovedGroups} approvedGroups={approvedGroups}/>
                            <div id='ApproveAreaControl'>
                                <button onClick={(e) => {createGroup()}}>Create Group</button>
                                <button onClick={(e) => {submitChange()}}>Submit Changes</button>
                            </div>
                            <div id='ApproveArea'>
                                {approvedGroups.length > 0 ?
                                    <>
                                        {   
                                            approvedGroups.map((group) => {
                                                return <ApprovedGroup key={`${group._id}`} setApprovedGroups={setApprovedGroups} approvedGroups={approvedGroups} newStudent={newStudent} setNewStudent={setNewStudent} group={group} hashMap={hashMap}/>
                                            })
                                        }
                                    </>
                                    :
                                    <div>no approve groups</div>
                                }
                            </div>
                        </DndProvider>
                    </div>
                </div>
            }
        </>
    )
}

export default SupervisorGroupManage


