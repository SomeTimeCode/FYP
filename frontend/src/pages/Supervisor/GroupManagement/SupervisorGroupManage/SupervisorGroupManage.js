import React, {useEffect, useState} from 'react'
import { DndProvider, useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


function Member(props){
    return(
        <div>member</div>
    )
}

function Group(props){
    return (
        <div>group</div>
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
        <div>
            {
                props.group_members.map((member) => {
                    return (
                        <p key={member}>{props.hashMap[member]}</p>
                    )
                })
            }
            <button onClick={(e) => {approve()}}>approve</button>
            <button onClick={(e) => {reject()}}>reject</button>
        </div>
    )
}



function SupervisorGroupManage() {

    const params = useParams();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState()

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
            console.log(response)
            setData(response)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <>
            {loading ?
                <div>fetching data</div>
            :
                <div>
                    <div>{data.topic_name}</div>
                    <div>pending approve or reject</div>
                    <div>
                        {
                            data.pending_groups.map((group) => {
                                return <PendingGroup key={group._id} _id={group._id} group_members={group.group_members} hashMap={data.student_hashMap}/> 
                            })
                        }
                    </div>
                    <div>
                        <div>approve adjustment</div>
                        <DndProvider backend={HTML5Backend}>
                            <div>create Group</div>
                        </DndProvider>
                    </div>
                </div>
            }
        </>
    )
}

export default SupervisorGroupManage



// //member
// function DragCard(props){
//     const [{ isDragging }, drag] = useDrag(() => ({
//         item: {index: props.index, _id: props.member},
//         type: "test",
//         collect: (monitor) => ({
//             isDragging: !!monitor.isDragging(),
//         }),
//     }) ,[])

//     return (
//         <div ref={drag} style={{height: "5vh", width: "100%", border: "1px solid black"}}>
//             {/* {props.hashMap[props.member]} */}
//         </div>
//     )
// }

// //group
// function Card(props){

//     const [{canDrop, isOver, getItem}, drop] = useDrop(() => ({
//         accept: "test",
//         getItem: () => {console.log(getItem()); return getItem()},
//         canDrop: () => {return true},
//         collect: (monitor) => ({
//             isOver: monitor.isOver(),
//             canDrop: monitor.canDrop(),
//             getItem: monitor.getItem()
//         }),
//         drop: (item, monitor) => {
//             console.log(props.index)
//             console.log(item)
//             var temp = [...props.pendingGroup]
//             console.log(temp)
//             temp[item.index].group_members = temp[item.index].group_members.filter(member => item._id !== member)
//             temp[props.index].group_members.push(item._id)
//             props.setPendingGroup(temp)
//         }
//     }), [])

//     return (
//         <div>
//             <button onClick={(e) => {props.setPendingGroup([{_id: "test", group_members: ["test", "123"]}, {_id: "123", group_members: ["test2", "1232"]}])}}>test</button>
//             <div ref={drop} style={{height: "20vh", width: "20vw", border: "1px solid black"}}>
//                 {/* {props.pendingGroup[props.index].group_members.map((key) => {return <DragCard key={key} index={props.index} hashMap={props.hashMap} member={key}/>})} */}
//             </div>
//         </div>
        
//     )
// }

// //topic
// function CardDeck(props){
    
//     function appendObjTo(thatArray, newObj) {
//         const frozenObj = Object.freeze(newObj);
//         return Object.freeze(thatArray.concat(frozenObj));
//       }

//     // const [pendingGroup, setPendingGroup] = useState(props.topic.pending_groups)
//     const [pendingGroup, setPendingGroup] = useState([...props.topic.pending_groups])

//     return (
//         <div>
//             <div>
//                 <div>
//                     <p>Topic Name: {props.topic.topic_name}</p>
//                     <p>Genre(s):
//                         {
//                             props.topic.genre.map((item) => {
//                                 return `${" "}${item}${" "}`
//                             })
//                         }
//                     </p>
//                 </div>
//                 <div>
//                     {pendingGroup.length === 0 ? `no pending` : `having pending`}
//                 </div>
//             </div>
//             {/* topic={topic} setTopicList={setTopicList} hashMap={hashMap} */}
//             {/* pendinggroup */}
//             <div>
//                 <div>
//                     {pendingGroup.length !== 0 ?
//                         <div>
//                             {
//                                 pendingGroup.map((group) => {
//                                     return (
//                                         <div key={group._id}>
//                                             {/* <p>{props.hashMap[group.group_members[0]]}'s group</p> */}
//                                         </div>
//                                     )
//                                 })
//                             }
//                         </div>
//                         :
//                         <>
//                             <div>no pending group</div>
//                         </>
//                     }
//                 </div>
//             </div>
//             {/* approved group */}
//             <div>
//                 {(pendingGroup.length > 0) && pendingGroup.map((group, index) => {
//                     return <Card key={`${group._id}-${group.group_members.length}`} index={index} pendingGroup={pendingGroup} setPendingGroup={setPendingGroup} hashMap={props.hashMap}/>
//                 })}
//             </div>
//         </div>
        
//     )
// }


{/* <DndProvider backend={HTML5Backend}>
                                {   
                                    topicList.map((topic) => {
                                        return <CardDeck key={topic._id} topic={topic} hashMap={hashMap}/>
                                    })
                                }
                                </DndProvider> */}