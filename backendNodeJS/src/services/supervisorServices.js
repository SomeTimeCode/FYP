const WebPA = (obj, student_list) => {
    console.log(obj)
    console.log(student_list)
    var student_scorce = {}
    student_list.forEach((student) => {
        student_scorce[student] = 0
    })
    // sum of student given
    Object.keys(obj).forEach((student) => {
        var sum = Object.values(obj[student]).reduce((a, b) => {
            if(b == null){
                b = 0
            }
            console.log(b)
            return parseInt(a) + parseInt(b)
        })
        if(sum == 0){
            sum = 1
        }
        Object.keys(obj[student]).forEach((student_response)=>{
            if(obj[student][student_response] == null){
                student_scorce[student_response] += 0
            }else{
                student_scorce[student_response] += parseInt(obj[student][student_response])/sum
            }
        })
    })
    //update fraction
    var total_response = Object.keys(obj).length
    if(total_response == 0){
        total_response = 1
    }
    Object.keys(student_scorce).forEach((student) => {
        student_scorce[student] = student_scorce[student] * (student_list.length/total_response)
    })
    return student_scorce
}

module.exports = {
    WebPA
}