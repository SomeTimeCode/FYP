from flask import Flask, jsonify, request, make_response
import recommendation

app = Flask(__name__)

@app.route("/")
def hello():
    t = {
        'a': 1,
        'b': 2,
        'c': [3, 4, 5]
    }
    return jsonify(t)

@app.route("/test", methods=['POST'])
def test():

    req = request.get_json()

    print(req)

    res = make_response(jsonify(req), 200)

    return res

@app.route("/recommend", methods=['POST'])
def recommend():
    req = request.get_json()
    # student_list = recommendation.nearestNeighors(req.pastStudents, req.newStudent)
    print(req)
    similar_interest_students = recommendation.nearestIntestestNeighors(req.get("pastStudentRatingData"), req.get("student_rating_list"))
    pastStudentList = []
    pastStudentData = []
    for i in range(len(similar_interest_students)):
        pastStudentList.append(req.get('pastStudentList')[similar_interest_students[i]])
        pastStudentData.append(req.get('pastStudentData')[similar_interest_students[i]])
    similar_grade_students = recommendation.nearestGradeNeighors(pastStudentData, req.get("student_course_list"))
    return_students = []
    for i in range(len(similar_grade_students)):
        return_students.append(pastStudentList[similar_grade_students[i]])
    print(return_students)
    res = make_response(jsonify(similar_students=return_students), 200)
    return res

if __name__ == "__main__":
    app.run(host="localhost", port=5001, debug=True)