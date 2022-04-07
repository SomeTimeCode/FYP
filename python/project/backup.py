def combinations(supervisor_time, group_time):
    # def combinations(examier_time, supervisor_time, group_time):
    """Returns all the possible combinations among the examiner, supervisor, and the corresponding groups.
  
    :param examier_time: available time for the groups' examiner
    :type examier_time: 
    :param city: textual input for city names to match in Postcode API
    :type city: str
    
    :rtype: (str, str), str, str
    :return: (longitude, latitude), Postcode API status code, Postcode API error message
    """
    # only one time slot
    if(len(group_time) == 0):
        return []
    elif(len(group_time) == 1):
        output = []
        group_name = list(group_time.keys())[0]
        group_required_time = group_time.get(group_name)[0]
        group_availble_time = group_time.get(group_name)[1]
        for i in range(len(group_availble_time) - group_required_time + 1):
            # if(check_approiate_timeslot(examier_time, supervisor_time, group_availble_time[i:i+group_required_time])):
            if(check_approiate_timeslot(supervisor_time, group_availble_time[i:i+group_required_time])):
                output.append([(group_name, group_availble_time[i:i+group_required_time])])
        return output
    else:
        output = []
        # start with least flexible
        least_flexibility_group = find_least_flexibility(group_time)
        group_name = least_flexibility_group[0]
        group_required_time = group_time.get(group_name)[0]
        group_availble_time = group_time.get(group_name)[1]
        # all the combination with the first least flexible element
        for i in range(len(group_availble_time) - group_required_time + 1):
            # if(check_approiate_timeslot(examier_time, supervisor_time, group_availble_time[i:i+group_required_time])):
            if(check_approiate_timeslot(supervisor_time, group_availble_time[i:i+group_required_time])):
                clone_group_time = group_time.copy()
                clone_group_time.pop(least_flexibility_group[0])
                clone_supervisor_time = supervisor_time.copy()
                # clone_examier_time = examier_time.copy()
                # clone_examier_time, clone_supervisor_time, clone_group_time = update_timeslot(clone_examier_time, clone_supervisor_time, clone_group_time, group_availble_time[i:i+group_required_time])
                clone_supervisor_time, clone_group_time = update_timeslot(clone_supervisor_time, clone_group_time, group_availble_time[i:i+group_required_time])
                # combinated = combinations(clone_examier_time, clone_supervisor_time, clone_group_time)
                combinated = combinations(clone_supervisor_time, clone_group_time)
                if(len(combinated) == 1):
                    temp = [(group_name, group_availble_time[i:i+group_required_time])] + combinated[0]
                    output.append(temp)
                elif(len(combinated) == 0):
                    output.append([(group_name, group_availble_time[i:i+group_required_time])])
                else:
                    for j in range(len(combinated)):
                        temp = [(group_name, group_availble_time[i:i+group_required_time])] + combinated[j]
                        output.append(temp)
        # all the combination without the first least flexible element
        clone_group_time = group_time.copy()
        clone_group_time.pop(least_flexibility_group[0])
        clone_supervisor_time = supervisor_time.copy()
        # clone_examier_time = examier_time.copy()
        # combinated = combinations(clone_examier_time, clone_supervisor_time, clone_group_time)
        combinated = combinations(clone_supervisor_time, clone_group_time)
        output+=(combinated)
        return output
        
def dfs(input_list):
    if(len(input_list) == 0):
        return []
    elif(len(input_list) == 1):
        return [input_list[0]]
    else:
        output = []
        combinated = dfs(input_list[1:])
        if(len(combinated) == 1):
            temp = [input_list[0]] + combinated
            output.append(temp)
        else:
            for i in range(len(combinated)):
                temp = [input_list[0]] + combinated[i]
                output.append(temp)
        output.append(dfs(input_list[1:]))
    return output

test = [0,1,2]
# print(dfs(test))


"""
    check approiate time
    26 should be the last
"""
# def check_approiate_timeslot(examier_time, supervisor_time, group_availble_time):
def check_approiate_timeslot(supervisor_time, group_availble_time):
    if(checkConsecutive(group_availble_time) == False):
        return False
    check = all(elem in supervisor_time for elem in group_availble_time)
    # check2 = all(elem in examier_time for elem in group_availble_time)
    # if(check and check2):
    if(check):
        return True
    else:
        return False


"""
    pop all if time taken arc consistency
"""
# def update_timeslot(examier_time, supervisor_time, group_availble_time, remove_time):
def update_timeslot(supervisor_time, group_availble_time, remove_time):
    supervisor_time = [i for i in supervisor_time if i not in remove_time]
    # examier_time = [i for i in examier_time if i not in remove_time]
    new_group_time = {}
    for key, value in group_availble_time.items():
        new_group_time[key] = [value[0], [i for i in value[1] if i not in remove_time]]
    # return examier_time, supervisor_time, new_group_time
    return supervisor_time, new_group_time




"""
    consective list
"""
def checkConsecutive(l):
    # see have out of range or not
    if len(l) == 1:
        return True
    elif l == list(range(min(l), max(l)+1)):
        new_list = [x for x in l[:-1] if (x-26)/27 == 0]
        if(len(new_list) == 0):
            return True
    return False


"""
    count consective
"""
def count_consec(required_time_slot,available_time):
    count = 0
    for i in range(len(available_time) - required_time_slot + 1):
        if(checkConsecutive(available_time[i:i+required_time_slot])):
            count+=1
    return count

"""
    start with the less flexibility or the second least flexibility
"""
def find_least_flexibility(group_time):
    # min_1 = (key, flex_number)
    group_name = list(group_time.keys())[0]
    required_time_slot = group_time.get(group_name)[0]
    available_time = group_time.get(group_name)[1]
    least_flexibility = (group_name, count_consec(required_time_slot, available_time))
    for i in range(1, len(group_time)):
        # if the number is smaller than min_1 then replace min_1 and min_1 will be compare min2
        group_name = list(group_time.keys())[i]
        required_time_slot = group_time.get(group_name)[0]
        available_time = group_time.get(group_name)[1]
        check = (group_name, count_consec(required_time_slot, available_time))
        if(check[1]<least_flexibility[1]):
            least_flexibility = check
    return least_flexibility

examier_time = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
supervisor_time = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
group_time = {
              "group_1": [3, [0,1,2,3,4,5]],
              "group_2": [3, [0,1,2,3,4,5]],
              "group_3": [2, [0,1,2,3,4,5]]
             }

# print(count_consec(2, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]))
# print(least_two_flex(group_time))
# print(find_least_flexibility(group_time))


            #   "group_2": [3, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]],
            #   "group_3": [2, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]]

    
output = combinations(supervisor_time, group_time)
lengths = list(len(l) for l in output)
maxLength = max( len(l) for l in output )
listWithMaxLength = list(l for l in output if len(l) == maxLength)
print(listWithMaxLength)