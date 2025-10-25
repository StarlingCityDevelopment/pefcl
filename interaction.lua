local blips = {}
local interacts = {}

local atms = { -870868698, -1126237515, 506770882, -1364697528 }
local banks = {
    vec3(243.11, 224.29, 106.29),
    vec3(314.35, -279.07, 54.17),
    vec3(-350.87, -49.81, 49.04),
    vec3(-1212.56, -330.71, 37.79),
    vec3(-2962.57, 482.96, 15.7),
    vec3(150.0, -1040.68, 29.37),
}

CreateThread(function()
    for i = 1, #atms do
        exports.sleepless_interact:addModel(atms[i], {
            name = "atm_model_" .. i,
            label = "Accéder à l'ATM",
            icon = "hand",
            cooldown = 2000,
            distance = 5.0,
            offset = vector3(0.5, 0.5, 0.5),
            onSelect = function()
                exports["pefcl"]:openAtm()
            end,
            canInteract = function(entity, distance, coords, id)
                return distance <= 2.0
            end,
        })
    end

    for i = 1, #banks do
        interacts[#interacts+1] = exports.sleepless_interact:addCoords(vec(banks[i].x, banks[i].y, banks[i].z + 0.5), {
            name = "bank_coords_" .. i,
            label = "Accéder à la banque",
            icon = "hand",
            cooldown = 2000,
            distance = 5.0,
            onSelect =function()
                exports["pefcl"]:openBank()
            end,
            canInteract = function(entity, distance, coords, id)
                return distance <= 2.0
            end,
        })
        blips[#blips + 1] = exports.gs_blips:CreateBlip({
            coords = banks[i],
            sprite = 108,
            scale = 0.6,
            color = 2,
            label = 'Fleeca Bank',
            data = {
                title = '💲 - Fleeca Bank',
                description = 'La banque Fleeca vous permet de gérer vos finances en toute sécurité. Faites un tour pour en savoir plus.',
            },
        })
    end
end)

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        for i = 1, #blips do
            RemoveBlip(blips[i])
        end
        for i = 1, #atms do
            exports.sleepless_interact:removeModel(atms[i])
        end
        for i = 1, #interacts do
            exports.sleepless_interact:removeCoords(interacts[i])
        end
    end
end)