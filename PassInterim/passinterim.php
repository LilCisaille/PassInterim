<?php
//== NE PAS TOUCHER
$titans = ['16;8;1155', '12;10;1081', '3;10;270', '17;7;1073', '13;9;1059', '22;6;1192'];
$habitations = ['21;36', '26;23', '16;48'];
$gaz = 1112;
//== NE PAS TOUCHER

$titans = array_map(function($titan) {
    return array_map('intval', explode(';', $titan));
}, $titans);

$habitations = array_map(function($habitation) {
    return array_map('intval', explode(';', $habitation));
}, $habitations);

usort($titans, function($a, $b) {
    return $b[0] - $a[0];
});

usort($habitations, function($a, $b) {
    return $a[0] - $b[0];
});

$total_points = 0;
$current_gaz = $gaz;
$current_height = 0;

function calc_power_and_gaz($height, $titan_height, $distance, $speed, $above) {
    if ($above) {
        $power = ($height - $titan_height) * 10 + $distance * 2 - $speed;
        $gaz_consumed = ($height - $titan_height + $distance);
    } else {
        $power = abs($height - $titan_height) * 5 + $distance * 2 - $speed;
        $gaz_consumed = abs($height - $titan_height + $distance);
    }
    return [$power, $gaz_consumed];
}

foreach ($titans as $titan) {
    list($t_height, $t_speed, $t_pv) = $titan;
    $best_habitation = null;
    $above = false;

    foreach ($habitations as $habitation) {
        list($h_height, $h_distance) = $habitation;
        if ($h_height > $t_height) {
            $best_habitation = $habitation;
            $above = true;
            break;
        } else {
            $best_habitation = $habitation;
        }
    }

    if ($best_habitation === null) {
        continue;
    }

    list($h_height, $h_distance) = $best_habitation;

    $move_gaz = abs($current_height - $h_height);
    if ($current_gaz < $move_gaz) {
        break;
    }

    $current_gaz -= $move_gaz;
    $current_height = $h_height;

    while ($t_pv > 0) {
        list($power, $gaz_consumed) = calc_power_and_gaz($h_height, $t_height, $h_distance, $t_speed, $above);
        if ($current_gaz < $gaz_consumed) {
            break;
        }

        $t_pv -= $power;
        $total_points += 1; // 1 pt par coup d'épée
        $current_gaz -= $gaz_consumed;
    }

    if ($t_pv <= 0) {
        $total_points += 100; // 100 pts par titan abattu
    }
}

echo $total_points;
?>