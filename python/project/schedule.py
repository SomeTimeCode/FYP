def checkConsecutive(timeslot):
    """Returns a Boolean that the timeslot given is consective
  
    :param timeslot: name of the supervisor
    :type timeslot: [timeslot]
    
    :rtype: correctness of the consecutive
    :return: Boolean
    """
    if len(timeslot) == 1:
        return True
    elif timeslot == list(range(min(timeslot), max(timeslot)+1)):
        new_list = [x for x in timeslot[:-1] if (x-26)/27 == 0]
        #cheeck there is the end of day exist in the duration of the timeslot
        if(len(new_list) == 0):
            return True
    return False


def count_consec(required_time_slot,available_time):
    """Returns a Boolean that the timeslot given is consective
  
    :param required_time_slot: Number of reuqired time slot for the presentaiton
    :type required_time_slot: Number
    :param available_time: available time-slot
    :type available_time: [timeslot]

    :rtype: Number of consective timeslot
    :return: Number
    """
    count = 0
    for i in range(len(available_time) - required_time_slot + 1):
        if(checkConsecutive(available_time[i:i+required_time_slot])):
            count+=1
    return count


def find_least_flexibility(group_time):
    """Returns a tuple contain the least flexibility group name and the number of consective timeslot that the group can provide base on the group's required time
  
    :param group_time: all the availble time for all groups
    :type group_time: Object group_name: [required_time_slot, [available_timeslot], supervisor_name, examiner_name]

    :rtype: Least Flexibility Group name and the corresponding flexibility
    :return: (String, Number)
    """
    group_name = list(group_time.keys())[0]
    required_time_slot = group_time.get(group_name)[0]
    available_time = group_time.get(group_name)[1]
    least_flexibility = (group_name, count_consec(required_time_slot, available_time))
    for i in range(1, len(group_time)):
        group_name = list(group_time.keys())[i]
        required_time_slot = group_time.get(group_name)[0]
        available_time = group_time.get(group_name)[1]
        check = (group_name, count_consec(required_time_slot, available_time))
        if(check[1]<least_flexibility[1]):
            least_flexibility = check
    return least_flexibility


def check_approiate_timeslot(supervisor_availble_time, examiner_availble_time, group_availble_time):
    """Returns a Boolean that the timeslot can be taken by the group for the presentation base on the timeslot taken, supervisor availability and the examiner availability
  
    :param supervisor_availble_time: all the available time for all supervisors
    :type supervisor_availble_time: [available_timeslot]
    :param examiner_availble_time: all the available time for all supervisors
    :type examiner_availble_time: [available_timeslot]
    :param group_availble_time: timeslot that provided by the group
    :type city: [available_timeslot]
    
    :rtype: check the timeslot is apporiate for the group to take
    :return: Boolean
    """
    # check the timeslot provided by the group is consecutive or not (which will not allow the end of day in the timeslot as well)
    if(checkConsecutive(group_availble_time) == False):
        return False
    # check the timeslot provided by the group is also availble for both supervisor and examiner
    check = all(elem in supervisor_availble_time for elem in group_availble_time)
    check2 = all(elem in examiner_availble_time for elem in group_availble_time)
    if(check and check2):
        return True
    else:
        return False


def update_timeslot(supervisor_name, examiner_name, supervisor_time, group_time, remove_time):
    """Returns a update for the supervisor_time and the group_time
  
    :param supervisor_name: name of the supervisor
    :type supervisor_name: string
    :param examiner_name: name of the examiner
    :type examiner_name: string
    :param supervisor_time: all the avialble time for all supervisors
    :type examiner_time: Object supervisor_name : [available_timeslot]
    :param group_time: all the availble time for all groups
    :type city: Object group_name: [required_time_slot, [available_timeslot], supervisor_name, examiner_name]
    :param remove_time: timeslot that need to remove 
    :type remove_time: [timeslot]
    
    :rtype: update the timeslot for both supervisor_time and the group_time
    :return: (supervisor_name : [available_timeslot]), (group_name: [required_time_slot, [available_timeslot], supervisor_name, examiner_name])
    """
    new_supervisor_time = supervisor_time.copy()
    new_supervisor_time[supervisor_name] = [i for i in new_supervisor_time[supervisor_name] if i not in remove_time]
    new_supervisor_time[examiner_name] = [i for i in new_supervisor_time[examiner_name] if i not in remove_time]
    new_group_time = {}
    for key, value in group_time.items():
        # update the group that have the given examiner and supervisor to be their examiner or supervisor
        if(value[2] == examiner_name or value[2] == supervisor_name or value[3] == examiner_name or value[3] == supervisor_name):
            new_group_time[key] = [value[0], [i for i in value[1] if i not in remove_time], value[2], value[3]]
        else:
            new_group_time[key] = value
    return new_supervisor_time, new_group_time

def combinations(supervisor_time, group_time):
    """Returns all the possible timeslot combinations among the examiner, supervisor, and the corresponding groups.
  
    :param supervisor_time: all the avialble time for all supervisors
    :type supervisor_time: Object supervisor_name : [available_timeslot]
    :param group_time: all the availble time for all groups
    :type group_time: Object group_name: [required_time_slot, [available_timeslot], supervisor_name, examiner_name]
    
    :rtype: All the possible groups for all groups with corresponding timeslot
    :return: [[(group_name, [timeslot])]]
    """
    if(len(group_time) == 0):
        # return empty if there is no any group_time
        return []
    elif(len(group_time) == 1):
        output = []
        group_name = list(group_time.keys())[0]
        group_required_time = group_time.get(group_name)[0]
        group_availble_time = group_time.get(group_name)[1]
        supervisor_name = group_time.get(group_name)[2]
        examiner_name = group_time.get(group_name)[3]
        supervisor_availble_time = supervisor_time[supervisor_name]
        examiner_availble_time = supervisor_time[examiner_name]
        #finding all possible timeslot for the group
        for i in range(len(group_availble_time) - group_required_time + 1):
            # check the timeslot is possible for the group base on the supervisor time, examiner time and the provided timeslot
            if(check_approiate_timeslot(supervisor_availble_time, examiner_availble_time,  group_availble_time[i:i+group_required_time])):
                return [(group_name, group_availble_time[i:i+group_required_time])]
                # output.append([(group_name, group_availble_time[i:i+group_required_time])])
        # return all the possible timeslots of the group
        return output
    else:
        output = []
        # finding the least flexibility group, in which have the most constraint timeslot
        least_flexibility_group = find_least_flexibility(group_time)
        group_name = least_flexibility_group[0]
        group_required_time = group_time.get(group_name)[0]
        group_availble_time = group_time.get(group_name)[1]
        supervisor_name = group_time.get(group_name)[2]
        examiner_name = group_time.get(group_name)[3]
        supervisor_availble_time = supervisor_time[supervisor_name]
        examiner_availble_time = supervisor_time[examiner_name]
        # finding all the possible timeslot for the least flexibility group
        for i in range(len(group_availble_time) - group_required_time + 1):
            # check the timeslot is possible for the group based on the superviosr time, examiner time and the provided timeslot
            print("test")
            if(check_approiate_timeslot(supervisor_availble_time, examiner_availble_time,  group_availble_time[i:i+group_required_time])):
                clone_group_time = group_time.copy()
                clone_group_time.pop(least_flexibility_group[0])
                clone_supervisor_time = supervisor_time.copy()
                # updating the supervisor, examiner, and the group which have the same supervisor and examiner availble time from the timeslot that taken away from the least flexibility group
                clone_supervisor_time, clone_group_time = update_timeslot(supervisor_name, examiner_name, clone_supervisor_time, clone_group_time, group_availble_time[i:i+group_required_time])
                # finding the rest of the combinations of the remaining group can form after the least flexibility group taken away the timeslot
                combinated = combinations(clone_supervisor_time, clone_group_time)
                if(len(combinated) == len(clone_group_time)):
                    print([(group_name, group_availble_time[i:i+group_required_time])] + combinated)
                    return [(group_name, group_availble_time[i:i+group_required_time])] + combinated
                # if(len(combinated) == len(clone_group_time)):
                #     print("check")
                #     return [(group_name, group_availble_time[i:i+group_required_time])] + combinated[0]
                # if(len(combinated) == 1):
                #     temp = [(group_name, group_availble_time[i:i+group_required_time])] + combinated[0]
                #     output.append(temp)
                # elif(len(combinated) == 0):
                #     output.append([(group_name, group_availble_time[i:i+group_required_time])])
                # else:
                #     for j in range(len(combinated)):
                #         temp = [(group_name, group_availble_time[i:i+group_required_time])] + combinated[j]
                #         output.append(temp)
        # finding all the possible timeslot without the least flexibility group
        clone_group_time = group_time.copy()
        clone_group_time.pop(least_flexibility_group[0])
        clone_supervisor_time = supervisor_time.copy()
        combinated = combinations(clone_supervisor_time, clone_group_time)
        output+=(combinated)
        return output

# supervisor_time = {
                # #supervisor_name: [availble_time]
                # "Supervisor1": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                # "Supervisor2": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                # "Supervisor3": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
                # "Supervisor4": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
            # }
# group_time = {
              # # group_name :[required_time, availble_time, supervisor_name, examiner_name]
              # 'A mobile application for schedule notifications_1': [2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 'Supervisor4', 'Supervisor1'],
              # 'A mobile application for schedule notifications_2': [2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], 'Supervisor4', 'Supervisor1'],
              # 'Application for Class Scheduling_1': [3, [0, 1, 3, 4, 6, 7], 'Supervisor1', 'Supervisor2']
            # #   "group_4": [2, [0,1,2,3,4,5], "supervisor_3", "supervisor_4"]
             # }

# output = combinations(supervisor_time, group_time)
# print(output)
# see = max(output, key=len)
# print(see)
