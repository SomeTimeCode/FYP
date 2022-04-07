# https://towardsdatascience.com/item-based-collaborative-filtering-in-python-91f747200fab
# https://arxiv.org/ftp/arxiv/papers/1908/1908.03475.pdf

from turtle import distance
from sklearn import metrics
from sklearn.neighbors import NearestNeighbors

# knn = NearestNeighbors(metric='euclidean', algorithm='brute')
# df = [
#         [0,0,3,4,2,1,2,0,5,1],
#         [3,0,1,3,0,0,0,0,0,0],
#         [0,3,0,4,0,2,0,0,0,2],
#         [5,2,3,2,0,4,3,3,0,0],
#         [0,5,5,0,0,0,0,0,5,4],
#         [0,0,0,0,4,0,4,2,3,0],
#         [4,4,0,0,4,4,3,4,0,4],
#         [5,0,4,2,3,0,3,3,3,3],
#         [0,3,0,0,5,5,0,4,0,0],
#         [2,0,0,0,0,0,0,0,4,0]
#     ]
# df = [[5, 4, 2, 0, 0], [2, 5, 1, 1, 0]]
# knn.fit(df)
# indices = knn.kneighbors(df, n_neighbors=2, return_distance=False)
# print(indices)

def nearestIntestestNeighors(pastStudentRatingData, student_rating_list):
    inputList = pastStudentRatingData.copy()
    inputList.append(student_rating_list)
    if(len(inputList) < 6):
        output_Number = len(inputList)
    else:
        output_Number = 20
    knn = NearestNeighbors(metric="euclidean", algorithm="brute")
    knn.fit(inputList)
    indices = knn.kneighbors(inputList, n_neighbors=output_Number, return_distance=False)
    ouptut = list(indices[-1])
    ouptut.remove(max(ouptut))
    return ouptut

def nearestGradeNeighors(pastStudentData, student_course_list):
    inputList = pastStudentData.copy()
    inputList.append(student_course_list)
    if(len(inputList) < 6):
        output_Number = len(inputList)
    else:
        output_Number = 6
    knn = NearestNeighbors(metric="cosine", algorithm="brute")
    knn.fit(inputList)
    indices = knn.kneighbors(inputList, n_neighbors=output_Number, return_distance=False)
    ouptut = list(indices[-1])
    ouptut.remove(max(ouptut))
    # print(ouptut)
    return ouptut
    

