# NE PAS TOUCHER
titans = ['16;8;1155', '12;10;1081', '3;10;270', '17;7;1073', '13;9;1059', '22;6;1192']
habitations = ['21;36', '26;23', '16;48']
gaz = 1112
# NE PAS TOUCHER

titans = [tuple(map(int, t.split(';'))) for t in titans]
habitations = [tuple(map(int, h.split(';'))) for h in habitations]
gaz = int(gaz)
titans.sort(key=lambda x: x[0], reverse=True)

habitations.sort(key=lambda x: x[0])

total_points = 0
current_gaz = gaz
current_height = 0

def calc_power_and_gaz(height, titan_height, distance, speed, above):
    if above:
        power = (height - titan_height) * 10 + distance * 2 - speed
        gaz_consumed = (height - titan_height + distance)
    else:
        power = abs(height - titan_height) * 5 + distance * 2 - speed
        gaz_consumed = abs(height - titan_height + distance)
    return power, gaz_consumed

for t_height, t_speed, t_pv in titans:
    best_habitation = None
    above = False

    for h_height, h_distance in habitations:
        if h_height > t_height:
            best_habitation = (h_height, h_distance)
            above = True
            break
        else:
            best_habitation = (h_height, h_distance)

    if best_habitation is None:
        continue

    h_height, h_distance = best_habitation

    move_gaz = abs(current_height - h_height)
    if current_gaz < move_gaz:
        break

    current_gaz -= move_gaz
    current_height = h_height

    while t_pv > 0:
        power, gaz_consumed = calc_power_and_gaz(h_height, t_height, h_distance, t_speed, above)
        if current_gaz < gaz_consumed:
            break

        t_pv -= power
        total_points += 1  # 1 pt par coup d'épée
        current_gaz -= gaz_consumed

    if t_pv <= 0:
        total_points += 100  # 100 pts par titan abattu

print(total_points)
